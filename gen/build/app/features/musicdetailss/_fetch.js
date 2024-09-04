import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function MusicdetailssInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/musicdetailss?function=init&parent="+parentID, p)
}

export function MusicdetailsUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/musicdetails?function=update&id="+id, p)
}

export function MusicdetailsObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/musicdetails?function=object&id="+id)
}

export function MusicdetailssListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/musicdetailss?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function MusicdetailssCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/musicdetailss?function=count&parent="+parentID)
}

export function MusicdetailsOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/musicdetails?function=order&mode="+mode+"&id="+id)
}

export function MusicdetailsDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/musicdetails?id="+id)
}

export function MusicdetailsFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/musicdetails?function="+func+"&id="+id)
}

export function MusicdetailsJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/musicdetails?function=job&job="+job+"&id="+id)
}

// file handling

export function MusicdetailsUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/musicdetails?function=upload&id="+id+"&mode="+mode, formData)
}

export function MusicdetailsInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/musicdetailss?function=upload&parent="+parentID, formData)
}

// misc

export function MusicdetailssModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/musicdetailss?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function MusicdetailssChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/musicdetailss?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function MusicdetailsAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/musicdetails?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
