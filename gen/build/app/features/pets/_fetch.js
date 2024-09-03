import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function PetsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/pets?function=init&parent="+parentID, p)
}

export function PetUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/pet?function=update&id="+id, p)
}

export function PetObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/pet?function=object&id="+id)
}

export function PetsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/pets?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function PetsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/pets?function=count&parent="+parentID)
}

export function PetOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/pet?function=order&mode="+mode+"&id="+id)
}

export function PetDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/pet?id="+id)
}

export function PetFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/pet?function="+func+"&id="+id)
}

export function PetJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/pet?function=job&job="+job+"&id="+id)
}

// file handling

export function PetUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/pet?function=upload&id="+id+"&mode="+mode, formData)
}

export function PetInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/pets?function=upload&parent="+parentID, formData)
}

// misc

export function PetsModelsPOST(user, parentID, model, mode, payload) {
    return SessionFetch(user, "POST", "api/pets?function=ai&model="+model+"&mode="+mode+"&parent="+parentID, payload)
}

export function PetsChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/pets?function=ai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function PetAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/pet?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
