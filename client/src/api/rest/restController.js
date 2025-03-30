import http from '../interceptor';

/////////////////////// CONTESTS ///////////////////////

export const getActiveContests = (data) =>
  http.get('contests/', { params: data });
export const updateContest = (data) => http.patch('contests/', data);
export const getContestById = (data) => http.get(`contests/${data.contestId}`);
export const dataForContest = (data) =>
  http.get('contests/data', { params: data });
export const getCustomersContests = (data) =>
  http.get('contests/customer', {
    params: {
      limit: data.limit,
      offset: data.offset,
      status: data.contestStatus,
    },
    headers: { status: data.contestStatus },
  });

export const downloadContestFile = (data) =>
  http.get(`downloadFile/${data.fileName}`);

///////////////////////// USER /////////////////////////

export const getUser = () => http.get('user/');
export const loginRequest = (data) => http.post('user/login', data);
export const registerRequest = (data) => http.post('user/registration', data);
export const updateUser = (data) => http.patch('user/', data);
export const changeRatingMark = (data) => http.patch('user/changeRatingMark', data);

///////////////////////// CHAT /////////////////////////

export const getPreviewChat = () => http.get('chat/');
export const getDialog = (data) => http.get(`chat/${data.interlocutorId}`);
export const newMessage = (data) => http.post('chat/', data);
export const changeChatFavorite = (data) => http.patch('chat/favorite', data);
export const changeChatBlock = (data) => http.patch('chat/block', data);

/////////////////////// CATALOGS ///////////////////////

export const getCatalogList = () => http.get('chat/catalogs/');
export const createCatalog = (data) => http.post('chat/catalogs/', data);
export const changeCatalogName = (data) =>
  http.patch(`chat/catalogs/${data.catalogId}`, data);
export const deleteCatalog = (data) =>
  http.delete(`chat/catalogs/${data.catalogId}`);
export const addChatToCatalog = (data) =>
  http.post(`chat/catalogs/${data.catalogId}/chats`, data);
export const removeChatFromCatalog = (data) =>
  http.delete(`chat/catalogs/${data.catalogId}/chats/${data.chatId}`);

/////////////////////// PAYMENTS ///////////////////////

export const payMent = (data) => http.post('bank/pay', data.formData);
export const cashOut = (data) => http.post('bank/cashout', data);

//////////////////////// OFFERS ////////////////////////

export const getOffers = (data) => http.get('offers/', { params: { ...data } });
export const setNewOffer = (data) => http.post('offers/', data);

export const setOfferStatus = (data) =>
  http.post(`offers/${data.offerId}`, data);
export const updateOffer = (data) => http.put(`offers/${data.offerId}`, data);
