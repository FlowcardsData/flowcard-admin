
import setting from '@/config/setting';
const Router = [
  {
    "id": 1,
    "pid": 0,
    "title": "首页",
    "icon": "el-icon-house",
    "path": "/dashboard",
    "component": "/dashboard/analysis",
    "children": [
      {
        "id": 3,
        "pid": 1,
        "title": "数据分析",
        "icon": "el-icon-data-analysis",
        "path": "/dashboard/analysis",
        "component": "/dashboard/analysis",
        "target": "_self",
      },
    ],
    "meta": {
      "title": "看板",
      "icon": "el-icon-house",
      "hide": 0
    },
    "redirect": "/dashboard/analysis"
  },
  {
    "id": 170,
    "pid": 0,
    "icon": "el-icon-_integral",
    "path": "/content",
    "component": "",
    "children": [
      {
        "id": 2560,
        "pid": 170,
        "icon": "el-icon-document",
        "path": "/content/videoarticle",
        "component": "/content/videoarticle",
        "meta": {
          "title": "产品列表",
          "icon": "el-icon-document",
          "hide": 0
        }
      },
    ],
    "meta": {
      "title": "内容",
      "icon": "el-icon-_integral",
      "hide": 0
    },
    "redirect": "/content/videoarticle"
  },
  {
    "id": 140,
    "pid": 0,
    "title": "用户",
    "icon": "el-icon-user",
    "path": "/member",
    "component": "",
    "target": "_self",
    "permission": "",
    "type": 0,
    "status": 1,
    "hide": 0,
    "note": "",
    "sort": 3,
    "create_user": 1,
    "create_time": 1634266096,
    "update_user": 1,
    "update_time": 1692327611,
    "mark": 1,
    "children": [
      {
        "id": 2527,
        "pid": 140,
        "title": "代理商管理",
        "icon": "el-icon-user-solid",
        "path": "/agent/agent",
        "component": "/agent/agent",
        "target": "_self",
        "permission": "",
        "type": 0,
        "status": 1,
        "hide": 0,
        "note": "",
        "sort": 10,
        "create_user": 1,
        "create_time": 1705994478,
        "update_user": 1,
        "update_time": 1705995326,
        "mark": 1,
        "children": [],
        "meta": {
          "title": "代理商管理",
          "icon": "el-icon-user-solid",
          "hide": 0
        }
      },
    ],
    "meta": {
      "title": "用户",
      "icon": "el-icon-user",
      "hide": 0
    },
    "redirect": "/agent/agent"
  },
  {
    "id": 2469,
    "pid": 0,
    "title": "订单",
    "icon": "el-icon-s-finance",
    "path": "/finance",
    "component": "",
    "children": [
      {
        "id": 2518,
        "pid": 2469,
        "icon": "el-icon-s-order",
        "path": "/finance/giftorder",
        "component": "/finance/giftorder",
        "meta": {
          "title": "卡品订单",
          "icon": "el-icon-s-order",
          "hide": 0
        }
      },
    ],
    "meta": {
      "title": "订单",
      "icon": "el-icon-s-finance",
      "hide": 0
    },
    "redirect": "/finance/giftorder"
  },
  {
    "id": 92,
    "pid": 0,
    "title": "运营",
    "icon": "el-icon-bank-card",
    "path": "/operate",
    "children": [
      {
        "id": 2362,
        "pid": 2569,
        "icon": "el-icon-school",
        "path": "/system/sysbank",
        "component": "/system/sysbank",
        "children": [],
        "meta": {
          "title": "资金流水",
          "icon": "el-icon-school",
          "hide": 0
        }
      },
      {
        "id": 2533,
        "pid": 92,
        "icon": "el-icon-user",
        "path": "/agent/agentlevel",
        "component": "/agent/agentlevel",
        "meta": {
          "title": "代理等级",
          "icon": "el-icon-user",
          "hide": 0
        }
      },
      {
        "id": 115,
        "pid": 92,
        "icon": "el-icon-set-up",
        "path": "/operate/ad",
        "component": "/operate/ad",
        "meta": {
          "title": "广告管理",
          "icon": "el-icon-set-up",
          "hide": 0
        }
      },
    ],
    "meta": {
      "title": "运营",
      "icon": "el-icon-bank-card",
      "hide": 0
    },
    "redirect": "/system/sysbank"
  },
  {
    "id": 4,
    "pid": 0,
    "title": "系统",
    "icon": "el-icon-setting",
    "path": "/system",
    "component": "",
    "children": [
      {
        "id": 51,
        "pid": 4,
        "icon": "el-icon-date",
        "path": "/system/loginlog",
        "component": "/system/loginlog",
        "meta": {
          "title": "登录日志",
          "icon": "el-icon-date",
          "hide": 0
        }
      },
    ],
    "meta": {
      "title": "系统",
      "icon": "el-icon-setting",
      "hide": 0
    },
    "redirect": "/system/loginlog"
  }
]

export default {
  namespaced: true,
  state: {
    // 当前用户信息
    user: setting.takeUser(),
    // 当前用户权限
    authorities: [],
    // 当前用户角色
    roles: [],
    // 当前用户的菜单
    menus: null,
    // 当前登录用户所拥有的权限节点
    permission: []
  },
  mutations: {
    // 修改值
    SET(state, obj) {
      state[obj.key] = obj.value;
    },
    // 修改token
    SET_TOKEN(state, obj) {
      setting.cacheToken(obj.token, obj.remember);
      state.token = obj.token;
      if (!obj.token) {
        state.user = {};
        state.menus = null;
        setting.cacheUser();
      }
    },
    // 设置权限
    SET_PERMISSION(state, data) {
      state.permission = data
    }
  },
  actions: {
    /**
     * 设置节点权限
     * @param {*} commit
     * @param {*} data
     */
    setPermission({ commit }, data) {
      commit('SET_PERMISSION', data)
    },
    /**
     * 缓存token
     * @param commit
     * @param token {String, {token: String, remember: String}}
     */
    setToken({ commit }, token) {
      let remember = true;
      if (typeof token === 'object') {
        remember = token.remember;
        token = token.token;
      }
      commit('SET_TOKEN', { token: token, remember: remember });
    },
    /**
     * 移除token
     * @param commit
     */
    removeToken({ commit }) {
      commit('SET_TOKEN', {});
    },
    /**
     * 设置用户信息
     * @param commit
     * @param user {Object} 用户信息
     */
    setUser({ commit }, user) {
      setting.cacheUser(user);
      commit('SET', { key: 'user', value: user });
    },
    /**
     * 设置用户权限
     * @param commit
     * @param authorities {Array<String>} 权限
     */
    setAuthorities({ commit }, authorities) {
      commit('SET', { key: 'authorities', value: authorities });
    },
    /**
     * 设置用户角色
     * @param commit
     * @param roles {Array<String>} 角色
     */
    setRoles({ commit }, roles) {
      commit('SET', { key: 'roles', value: roles });
    },
    /**
     * 设置用户菜单
     * @param commit
     * @param menus {Array} 菜单
     */
    setMenus({ commit }, menus) {
      commit('SET', { key: 'menus', value: menus });
    },
    /**
     * 获取用户菜单路由
     * @param commit
     * @returns {Promise} {Array}
     */
    getMenus({ commit }) {
      return new Promise((resolve) => {
        // 处理菜单数据格式
        commit('SET', { key: 'menus', value: Router });
        resolve({ menus: Router, home: '/dashboard/analysis' });
      });
    }
  }
}
