import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function BookcharactersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/bookcharacters?function=init&parent="+parentID, p)
}

export function BookcharacterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/bookcharacter?function=update&id="+id, p)
}

export function BookcharacterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/bookcharacter?function=object&id="+id)
}

export function BookcharactersListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/bookcharacters?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function BookcharactersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/bookcharacters?function=count&parent="+parentID)
}

export function BookcharacterOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/bookcharacter?function=order&mode="+mode+"&id="+id)
}

export function BookcharacterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/bookcharacter?id="+id)
}

export function BookcharacterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/bookcharacter?function="+func+"&id="+id)
}

export function BookcharacterJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/bookcharacter?function=job&job="+job+"&id="+id)
}

// file handling

export function BookcharacterUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/bookcharacter?function=upload&id="+id+"&mode="+mode, formData)
}

export function BookcharacterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/bookcharacters?function=upload&parent="+parentID, formData)
}

// misc

export function BookcharactersChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/bookcharacters?function=openai&mode="+mode+"&parent="+parentID, payload)
}

export function BookcharactersChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/bookcharacters?function=openai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function BookcharacterAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/bookcharacter?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
