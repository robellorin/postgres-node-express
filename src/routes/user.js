import { Router } from 'express';
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
    const { usertypes, userOp } = req.body;
    const { AD, INET } = req.body.query;
    const include = [];
    const inetIncludeArr = [];
    const adIncludeArr = [];
    let condition = {};
    let adCondition = {};
    let inetCondition = {};
    let adUserLastSeenCondition = {};
    if (AD && AD.lastSeenUsersCount) {
      adUserLastSeenCondition = {
        order: [['user_id', 'DESC']],
        limit: AD.lastSeenUsersCount
      };
    }
    if (usertypes.length === 1 && usertypes[0] === 'AD') {
      include.push({
        model: req.models.Liv2FilterAdUsersList,
        required: true
      });
    } else if (usertypes.length === 1 && usertypes[0] === 'INET') {
      include.push({
        model: req.models.Liv2FilterIprangesList,
        required: true,
      });
    } else if (usertypes.length === 2 && userOp === 'and') {
      let inetInclude = {
        model: req.models.Liv2FilterIprangesList,
        required: true
      }
      let adInclude = {
        model: req.models.Liv2FilterAdUsersList,
        required: true,
        through: { attributes: [], ...adUserLastSeenCondition }
      }
      include.push(inetInclude);
      include.push(adInclude);
    } else if (usertypes.length === 2 && userOp === 'or') {
      adIncludeArr.push({
        model: req.models.Liv2FilterAdUsersList,
        required: true,
      });
      inetIncludeArr.push({
        model: req.models.Liv2FilterIprangesList,
        required: true,
      });
    }

    if (usertypes.length === 2 && userOp === 'or') {
      adCondition = {
        where: {
          user_id: {
            [Op[AD.Op]]: AD.user_id,
          },
        },
      };
      inetCondition = {
        where: {
          user_id: {
            [Op[INET.Op]]: INET.user_id,
          },
        },
      };
    } else {
      if (AD && AD.user_id && AD.Op) {
        condition = {
          ...condition,
          where: {
            user_id: {
              [Op[AD.Op]]: AD.user_id,
            },
          },
          ...adUserLastSeenCondition
        };
      }

      if (INET && INET.user_id && INET.Op) {
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

    if (usertypes.length === 2 && userOp === 'or') {
      const inetUsersArr = {
        ...inetCondition,
        include: inetIncludeArr,
        raw: true,
        nest: true
      }
      let inetUsers = await req.models.Liv2Users.findAll(inetUsersArr);
      const adUsersArr = {
        ...adCondition,
        include: adIncludeArr,
        ...adUserLastSeenCondition,
        raw: true,
        nest: true
      }
      let adUsers = await req.models.Liv2Users.findAll(adUsersArr);
      users = arrayMergeOr(inetUsers, adUsers)
    } else {
      const findAllCondition = {
        ...condition,
        include
      }
      users = await req.models.Liv2Users.findAll(findAllCondition);
    }

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
    await req.models.Liv2Users.update(data, {
      where: { user_id: req.params.id },
    });
    req.sequelize.close().then(() => {
      console.log('connection closed');
    });
    return res.send({
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
    const { user_label, user_comments, group_id } = req.body;
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
      data: newUser,
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
    const { user_label, user_comments } = req.body;
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
    const { aduser_ip_lastseen, op } = req.body;

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
