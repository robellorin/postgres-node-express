import { Router } from 'express';
import Sequelize from 'sequelize';
const { Op } = require('sequelize');

const router = Router();

const arrayMergeOr = (arr1, arr2) => {
  const map = new Map();
  arr1.forEach(item => map.set(item.user_id, item));
  arr2.forEach(item => map.set(item.user_id, {...map.get(item.user_id), ...item}));
  const mergedArr = Array.from(map.values());
  return mergedArr;
}

const arrayMergeAnd = (arr1, arr2) => {
  arr3 = arr1.filter(a => arr2.some(b => a.user_id === b.user_id));
  arr4 = arr2.filter(a => arr1.some(b => a.user_id === b.user_id));
  return arrayMergeOr(arr3, arr4);
}

router.get('/', async (req, res) => {
  try {
    let { usertypes, userOp } = req.body;
    usertypes = usertypes.map(usertype=>usertype.toUpperCase())
    userOp = userOp? userOp.toUpperCase(): null;
    const { AD, INET } = req.body.query;
    const include = [];
    const inetIncludeArr = [];
    const adIncludeArr = [];
    let condition = {};
    let adCondition = {};
    let inetCondition = {};
    let adUserLastSeenDaysCondition = {};
    let order = [];
    const orderCondition = [
      [Sequelize.literal(`"FilterAdusersLists->FilterAdusersIplists".`), 'aduser_ip_lastseen', 'DESC']
    ];
    if (AD && AD.lastSeenDays && usertypes.indexOf("AD")>=0) {
      adUserLastSeenDaysCondition = {
        aduser_ip_lastseen: {
          [Op.gte]: Sequelize.literal(`(now() - interval '${AD.lastSeenDays} day')`),
        },
      };
      order = orderCondition;
    }
    let adLastSeenInclude = null;
    adLastSeenInclude = {
      model: req.models.Liv2FilterAdusersIplist,
      required: (usertypes.indexOf("AD")>=0 && AD && AD.lastSeenDays) ? true: false,
      where: adUserLastSeenDaysCondition
    }

    if (usertypes.indexOf("AD")>=0 && usertypes.indexOf("INET")<0) {
      include.push({
        model: req.models.Liv2FilterAdUsersList,
        required: true,
        include: adLastSeenInclude
      });
    } else if (usertypes.indexOf("AD")<0 && usertypes.indexOf("INET")>=0) {
      include.push({
        model: req.models.Liv2FilterIprangesList,
        required: true,
      });
    } else if (usertypes.indexOf("AD")>=0 && usertypes.indexOf("INET")>=0 && userOp === 'AND') {
      let adInclude = {
        model: req.models.Liv2FilterAdUsersList,
        required: true,
        include: adLastSeenInclude
      }
      let inetInclude = {
        model: req.models.Liv2FilterIprangesList,
        required: true
      }
      include.push(inetInclude);
      include.push(adInclude);
    } else if (usertypes.indexOf("AD")>=0 && usertypes.indexOf("INET")>=0 && userOp === 'OR') {
      adIncludeArr.push({
        model: req.models.Liv2FilterAdUsersList,
        required: true,
        include: adLastSeenInclude
      });
      inetIncludeArr.push({
        model: req.models.Liv2FilterIprangesList,
        required: true,
      });
    }

    if (usertypes.indexOf("AD")>=0 && usertypes.indexOf("INET")>=0 && userOp === 'OR') {
      if (AD && AD.user_id && AD.Op) {
        adCondition = {
          where: {
            user_id: {
              [Op[AD.Op]]: AD.user_id,
            },
          },
          include: {
            model: req.models.Liv2FilterAdusersIplist,
            required: true,
            include: adLastSeenInclude
          }
        };
      }
      if (INET && INET.user_id && INET.Op) {
        inetCondition = {
          where: {
            user_id: {
              [Op[INET.Op]]: INET.user_id,
            },
          },
        };
      }
    } else {
      if (usertypes.indexOf("AD")>=0 && AD && AD.user_id && AD.Op) {
        condition = {
          ...condition,
          where: {
            user_id: {
              [Op[AD.Op]]: AD.user_id,
            },
          },
          include: adLastSeenInclude
        };
        if (AD.lastSeenDays) {
          condition.order = order
        }
      }

      if (usertypes.indexOf("INET")>=0 && INET && INET.user_id && INET.Op) {
        condition = {
          ...condition,
          where: {
            user_id: {
              [Op[INET.Op]]: INET.user_id,
            },
          },
        };
      }
    }

    let users = null;

    if (usertypes.indexOf("AD")>=0 && usertypes.indexOf("INET")>=0 && userOp === 'OR') {
      const adUsersArr = {
        ...adCondition,
        include: adIncludeArr,
        order
      }
      const inetUsersArr = {
        ...inetCondition,
        include: inetIncludeArr
      }
      let adUsers = await req.models.Liv2Users.findAll(adUsersArr);
      const adUsersPlainResult = adUsers.map((node) => node.get({ plain: true }));
      let inetUsers = await req.models.Liv2Users.findAll(inetUsersArr);
      const inetUsersPlainResult = inetUsers.map((node) => node.get({ plain: true }));
      users = arrayMergeOr(inetUsersPlainResult, adUsersPlainResult)
    } else {
      const findAllCondition = {
        ...condition,
        include,
        order
      }
      users = await req.models.Liv2Users.findAll(findAllCondition);
    }

    const lastUserId = await req.models.Liv2Users.findOne(
      {
        order: [
          ['user_id', 'DESC']
        ]
      }
    )

    const retVal = {
      lastUserId: lastUserId.user_id,
      users
    }

    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send(retVal);
  } catch (err) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const existingUser = await req.models.Liv2Users.findOne({
      where: {
        user_id: req.params.id,
      },
    });

    if (!existingUser) {
      return res.status(500).send({
        message: `Could not find the record to update.`,
      });
    }

    const data = req.body;
    const result = await req.models.Liv2Users.update(data, {
      where: { user_id: req.params.id },
      returning: true
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      data: result,
      message: `Successfully updated!`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
});

router.put('/', async (req, res, next) => {
  try {
    const condition = req.body.query;

    const data = req.body.data;
    const result = await req.models.Liv2Users.update(data, {
      where: condition,
      returning: true
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      data: result,
      message: `Successfully updated!`,
    });
  } catch (error) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(error);
    return res.status(500).send({
      message: error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_label, user_comments, group_id } = req.body.data;
    const newUser = await req.models.Liv2Users.create({
      is_group: true,
      user_label,
      user_comments,
    });

    const newUserGroup = await req.models.Liv2UserInGroups.create({
      user_id: newUser.user_id,
      in_group_id: group_id || 1,
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
      message: `Successfully crated!`,
      data: {
        newUser,
        newUserGroup
      },
    });
  } catch (err) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { user_label, user_comments } = req.body.data;
    const updatedUser = await req.models.Liv2Users.update(
      {
        user_label,
        user_comments,
      },
      {
        where: {
          user_id: req.params.id,
          is_group: true,
        },
      },
    );

    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.json({
      message: `Successfully updated!`,
      data: updatedUser,
    });
  } catch (err) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

router.get('/active', async (req, res) => {
  try {
    const { aduser_ip_lastseen, op } = req.body.query;

    const users = await req.models.Liv2FilterAdUsersList.findAll({
      include: [
        {
          model: req.models.Liv2FilterAdusersIplist,
          where: {
            aduser_ip_lastseen: {
              [Op[op]]: aduser_ip_lastseen,
            },
          },
        },
        {
          model: req.models.Liv2FilterAdgroupsList,
        },
      ],
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send(users);
  } catch (err) {
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
