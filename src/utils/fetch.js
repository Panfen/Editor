import { hashHistory } from 'react-router';
import { message } from 'antd';
import { fetch } from '@aistarfish/utils';

/**
 * 数据处理
 */
function getData(data) {
  if (!data) {
    message.error('数据请求失败');
  } else {
    // 登录超时处理
    if (data && data.code === 'SESSION_TIME_OUT') {
      message.error(data.msg || '登录超时');
      return {};
    }
    // 成功后对出错的CODE处理
    if (data.code !== 'SUCCESS') {
      message.error(data.msg || '数据请求失败');
    }
  }
  return { data };
}

export default function request(url, options = {}) {
  return fetch(url, options).then(getData).catch((err) => ({ err }));
}
