import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ClassofthingssInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/classofthingss?function=init&parent="+parentID, p)
}

export function ClassofthingsUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/classofthings?function=update&id="+id, p)
}

export function ClassofthingsObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/classofthings?function=object&id="+id)
}

export function ClassofthingssListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/classofthingss?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function ClassofthingssCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/classofthingss?function=count&parent="+parentID)
}

export function ClassofthingsOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/classofthings?function=order&mode="+mode+"&id="+id)
}

export function ClassofthingsDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/classofthings?id="+id)
}

export function ClassofthingsFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/classofthings?function="+func+"&id="+id)
}

export function ClassofthingsJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/classofthings?function=job&job="+job+"&id="+id)
}

// file handling

export function ClassofthingsUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/classofthings?function=upload&id="+id+"&mode="+mode, formData)
}

export function ClassofthingsInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/classofthingss?function=upload&parent="+parentID, formData)
}

// misc

export function ClassofthingssModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/classofthingss?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function ClassofthingssChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/classofthingss?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function ClassofthingsAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/classofthings?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
