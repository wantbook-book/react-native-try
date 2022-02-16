export const BASE_URI = 'http://10.0.2.2:9000/api/';
export const PING = 'ping';
export const ACCOUNT_LOGIN = 'account/login';
export const ACCOUNT_VALIDATEVCODE = 'account/validate-vcode';
export const ACCOUNT_UPLOADAVATAR = 'account/upload-avatar';
export const ACCOUNT_UPLOADINFO = 'account/upload-info';

export const FRIEND_VISITORS = 'friend/visitors';
export const FRIEND_TODAYBEST = 'friend/today-best';
export const FRIEND_RECOMMEND = 'friend/recommend';
export const FRIEND_CARDS = 'friend/cards';
export const FRIEND_SETLIKE = 'friend/set/:id/:islike';
export const FRIEND_LOCALSEARCH = 'friend/local-search';
export const FRIEND_QUESTIONS = 'friend/questions/:id';
export const FRIEND_SUBMITANSWERS = 'friend/submit-answers/:id';

export const FRIEND_DETAIL = 'friend/detail/:id';

export const GROUP_RECOMMEND = 'group/recommend';
//给一条动态点赞
export const GROUP_LIKE = 'group/like/:id';
//获取一条动态所有的评论
export const GROUP_COMMENTS = 'group/comments/:id';
//对一个动态不感兴趣
export const GROUP_NOINTEREST = 'group/nointerest/:id';
//对一个动态添加评论
export const GROUP_ADDCOMMENT = 'group/add-comment/:id';
//上传文件，图片
export const GROUP_UPLOADFILE = 'group/upload-file';

export const MY_INFO = 'my/info';
