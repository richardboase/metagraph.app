import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function AnimalsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/animals?function=init&parent="+parentID, p)
}

export function AnimalUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/animal?function=update&id="+id, p)
}

export function AnimalObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/animal?function=object&id="+id)
}

export function AnimalsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/animals?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function AnimalsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/animals?function=count&parent="+parentID)
}

export function AnimalOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/animal?function=order&mode="+mode+"&id="+id)
}

export function AnimalDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/animal?id="+id)
}

export function AnimalFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/animal?function="+func+"&id="+id)
}

export function AnimalJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/animal?function=job&job="+job+"&id="+id)
}

// file handling

export function AnimalUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/animal?function=upload&id="+id+"&mode="+mode, formData)
}

export function AnimalInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/animals?function=upload&parent="+parentID, formData)
}

// misc

export function AnimalsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/animals?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function AnimalsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/animals?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function AnimalAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/animal?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
