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

export function CharactersListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/characters?function=list&parent="+parentID+"&limit="+limit)
}

export function CharactersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/characters?function=count&parent="+parentID)
}

export function CharacterMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/character?function=up&id="+id)
}

export function CharacterMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/character?function=down&id="+id)
}

export function CharacterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/character?id="+id)
}

export function CharacterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/character?function="+func+"&id="+id)
}

// file handling

export function CharacterUpload(user, id, formData) {
    return AxiosPOST(user, "api/character?function=upload&id="+id, formData)
}

export function CharacterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/characters?function=initupload&parent="+parentID, formData)
}

export function CharacterInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/characters?function=inituploads&parent="+parentID, formData)
}

// misc

export function CharacterChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function CharacterChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/characters?function=prompt&parent="+parentID, payload)
}

export function CharacterChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/character?function=prompt&id="+id, payload)
}