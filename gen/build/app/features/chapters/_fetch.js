import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ChaptersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/chapters?function=init&parent="+parentID, p)
}

export function ChapterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/chapter?function=update&id="+id, p)
}

export function ChapterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/chapter?function=object&id="+id)
}

export function ChaptersListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/chapters?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function ChaptersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/chapters?function=count&parent="+parentID)
}

export function ChapterOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/chapter?function=order&mode="+mode+"&id="+id)
}

export function ChapterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/chapter?id="+id)
}

export function ChapterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/chapter?function="+func+"&id="+id)
}

export function ChapterJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/chapter?function=job&job="+job+"&id="+id)
}

// file handling

export function ChapterUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/chapter?function=upload&id="+id+"&mode="+mode, formData)
}

export function ChapterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/chapters?function=upload&parent="+parentID, formData)
}

// misc

export function ChaptersChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/chapters?function=prompt&mode="+mode+"&parent="+parentID, payload)
}

export function ChaptersChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/chapters?function=prompt&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

export function ChapterAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/chapter?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
