import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ArthursInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/arthurs?function=init&parent="+parentID, p)
}

export function ArthurUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/arthur?function=update&id="+id, p)
}

export function ArthurObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/arthur?function=object&id="+id)
}

export function ArthursListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/arthurs?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function ArthursCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/arthurs?function=count&parent="+parentID)
}

export function ArthurOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/arthur?function=order&mode="+mode+"&id="+id)
}

export function ArthurDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/arthur?id="+id)
}

export function ArthurFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/arthur?function="+func+"&id="+id)
}

export function ArthurJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/arthur?function=job&job="+job+"&id="+id)
}

// file handling

export function ArthurUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/arthur?function=upload&id="+id+"&mode="+mode, formData)
}

export function ArthurInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/arthurs?function=upload&parent="+parentID, formData)
}

// misc

export function ArthursChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/arthurs?function=openai&mode="+mode+"&parent="+parentID, payload)
}

export function ArthursVertexPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/arthurs?function=vertex&mode="+mode+"&parent="+parentID, payload)
}

export function ArthursChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/arthurs?function=openai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function ArthurAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/arthur?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
