import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ParentsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/parents?function=init&parent="+parentID, p)
}

export function ParentUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/parent?function=update&id="+id, p)
}

export function ParentObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/parent?function=object&id="+id)
}

export function ParentsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/parents?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function ParentsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/parents?function=count&parent="+parentID)
}

export function ParentOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/parent?function=order&mode="+mode+"&id="+id)
}

export function ParentDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/parent?id="+id)
}

export function ParentFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/parent?function="+func+"&id="+id)
}

export function ParentJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/parent?function=job&job="+job+"&id="+id)
}

// file handling

export function ParentUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/parent?function=upload&id="+id+"&mode="+mode, formData)
}

export function ParentInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/parents?function=upload&parent="+parentID, formData)
}

// misc

export function ParentsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/parents?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function ParentsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/parents?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function ParentAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/parent?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
