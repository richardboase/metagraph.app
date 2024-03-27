import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function FloorsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/floors?function=init&parent="+parentID, p)
}

export function FloorUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/floor?function=update&id="+id, p)
}

export function FloorObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/floor?function=object&id="+id)
}

export function FloorsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/floors?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function FloorsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/floors?function=count&parent="+parentID)
}

export function FloorOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/floor?function=order&mode="+mode+"&id="+id)
}

export function FloorDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/floor?id="+id)
}

export function FloorFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/floor?function="+func+"&id="+id)
}

export function FloorJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/floor?function=job&job="+job+"&id="+id)
}

// file handling

export function FloorUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/floor?function=upload&id="+id+"&mode="+mode, formData)
}

export function FloorInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/floors?function=upload&parent="+parentID, formData)
}

// misc

export function FloorsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/floors?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function FloorsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/floors?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function FloorAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/floor?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
