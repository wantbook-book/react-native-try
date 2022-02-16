/**
 *
 * @param {Error} err
 * @param {String} where
 */
const error = (err, where) => {
  console.log('err:===================' + where + '========================');
  console.log(err);
  console.log('err:===================' + where + '========================');
};
/**
 *
 * @param {String} msg
 * @param {String} where
 */
const log = (msg, where) => {
  console.log(
    'log:=====================' + where + '=========================',
  );
  console.log(msg);
  console.log(
    'log:=======================' + where + '=======================',
  );
};
const logObj = (msgObj, where) => {
  console.log(
    'log:=====================' + where + '=========================',
  );
  console.log(JSON.stringify(msgObj));
  console.log(
    'log:=======================' + where + '=======================',
  );
};
export default {
  error: error,
  log: log,
  logObj: logObj,
};
