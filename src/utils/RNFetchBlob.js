import {BASE_URI} from './pathMap';
import RNFetchBlob from 'rn-fetch-blob';
/**
 *
 * @param {String} url  接口地址
 * @param {String} fileName 文件名
 * @param {String} fileType 文件类型
 * @param {String} fileUri 文件本地地址 file://xxx
 * @returns {Promise} 返回结果
 */
const uploadFile = (url, fileName, fileType, fileUri) => {
  return RNFetchBlob.fetch(
    'POST',
    BASE_URI + url,
    {
      Authorization: 'Bearer access-token',
      'Content-Type': 'multipart/form-data',
    },
    [
      // element with property `filename` will be transformed into `file` in form data
      {
        name: 'file',
        filename: fileName,
        type: fileType,
        data: RNFetchBlob.wrap(fileUri),
      },
    ],
  );
};
export default {
  uploadFile: uploadFile,
};
