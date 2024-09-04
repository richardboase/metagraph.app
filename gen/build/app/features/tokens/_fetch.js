import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function TokensInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/tokens?function=init&parent="+parentID, p)
}

export function TokenUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/token?function=update&id="+id, p)
}

export function TokenObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/token?function=object&id="+id)
}

export function TokensListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/tokens?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function TokensCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/tokens?function=count&parent="+parentID)
}

export function TokenOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/token?function=order&mode="+mode+"&id="+id)
}

export function TokenDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/token?id="+id)
}

export function TokenFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/token?function="+func+"&id="+id)
}

export function TokenJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/token?function=job&job="+job+"&id="+id)
}

// file handling

export function TokenUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/token?function=upload&id="+id+"&mode="+mode, formData)
}

export function TokenInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/tokens?function=upload&parent="+parentID, formData)
}

// misc

export function TokensModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/tokens?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function TokensChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/tokens?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function TokenAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/token?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
