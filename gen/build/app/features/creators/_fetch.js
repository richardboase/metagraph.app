import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function CreatorsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/creators?function=init&parent="+parentID, p)
}

export function CreatorUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/creator?function=update&id="+id, p)
}

export function CreatorObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/creator?function=object&id="+id)
}

export function CreatorsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/creators?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function CreatorsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/creators?function=count&parent="+parentID)
}

export function CreatorOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/creator?function=order&mode="+mode+"&id="+id)
}

export function CreatorDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/creator?id="+id)
}

export function CreatorFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/creator?function="+func+"&id="+id)
}

export function CreatorJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/creator?function=job&job="+job+"&id="+id)
}

// file handling

export function CreatorUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/creator?function=upload&id="+id+"&mode="+mode, formData)
}

export function CreatorInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/creators?function=upload&parent="+parentID, formData)
}

// misc

export function CreatorsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/creators?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function CreatorsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/creators?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function CreatorAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/creator?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
