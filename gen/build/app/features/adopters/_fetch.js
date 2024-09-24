import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function AdoptersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/adopters?function=init&parent="+parentID, p)
}

export function AdopterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/adopter?function=update&id="+id, p)
}

export function AdopterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/adopter?function=object&id="+id)
}

export function AdoptersListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/adopters?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function AdoptersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/adopters?function=count&parent="+parentID)
}

export function AdopterOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/adopter?function=order&mode="+mode+"&id="+id)
}

export function AdopterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/adopter?id="+id)
}

export function AdopterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/adopter?function="+func+"&id="+id)
}

export function AdopterJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/adopter?function=job&job="+job+"&id="+id)
}

// file handling

export function AdopterUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/adopter?function=upload&id="+id+"&mode="+mode, formData)
}

export function AdopterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/adopters?function=upload&parent="+parentID, formData)
}

// misc

export function AdoptersModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/adopters?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function AdoptersChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/adopters?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function AdopterAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/adopter?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
