import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function JellynamesInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/jellynames?function=init&parent="+parentID, p)
}

export function JellynameUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/jellyname?function=update&id="+id, p)
}

export function JellynameObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/jellyname?function=object&id="+id)
}

export function JellynamesListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/jellynames?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function JellynamesCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/jellynames?function=count&parent="+parentID)
}

export function JellynameOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/jellyname?function=order&mode="+mode+"&id="+id)
}

export function JellynameDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/jellyname?id="+id)
}

export function JellynameFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/jellyname?function="+func+"&id="+id)
}

export function JellynameJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/jellyname?function=job&job="+job+"&id="+id)
}

// file handling

export function JellynameUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/jellyname?function=upload&id="+id+"&mode="+mode, formData)
}

export function JellynameInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/jellynames?function=upload&parent="+parentID, formData)
}

// misc

export function JellynamesModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/jellynames?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function JellynamesChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/jellynames?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function JellynameAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/jellyname?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
