import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function CharactersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/characters?function=init&parent="+parentID, p)
}

export function CharacterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/character?function=update&id="+id, p)
}

export function CharacterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/character?function=object&id="+id)
}

export function CharactersListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/characters?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function CharactersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/characters?function=count&parent="+parentID)
}

export function CharacterOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/character?function=order&mode="+mode+"&id="+id)
}

export function CharacterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/character?id="+id)
}

export function CharacterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/character?function="+func+"&id="+id)
}

export function CharacterJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/character?function=job&job="+job+"&id="+id)
}

// file handling

export function CharacterUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/character?function=upload&id="+id+"&mode="+mode, formData)
}

export function CharacterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/characters?function=upload&parent="+parentID, formData)
}

// misc

export function CharactersChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/characters?function=openai&mode="+mode+"&parent="+parentID, payload)
}

export function CharactersChatGPTCollectionPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/characters?function=openai&mode="+mode+"&parent="+parentID+"&collection="+collectionID, payload)
}

// permissions

export function CharacterAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/character?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}
