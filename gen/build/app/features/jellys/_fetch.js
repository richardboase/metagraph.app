import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function JellysInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/jellys?function=init&parent="+parentID, p)
}

export function JellyUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/jelly?function=update&id="+id, p)
}

export function JellyObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/jelly?function=object&id="+id)
}

export function JellysListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/jellys?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function JellysCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/jellys?function=count&parent="+parentID)
}

export function JellyOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/jelly?function=order&mode="+mode+"&id="+id)
}

export function JellyDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/jelly?id="+id)
}

export function JellyFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/jelly?function="+func+"&id="+id)
}

export function JellyJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/jelly?function=job&job="+job+"&id="+id)
}

// file handling

export function JellyUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/jelly?function=upload&id="+id+"&mode="+mode, formData)
}

export function JellyInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/jellys?function=upload&parent="+parentID, formData)
}

// misc

export function JellysModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/jellys?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function JellysChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/jellys?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function JellyAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/jelly?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
