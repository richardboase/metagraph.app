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

export function BookcharactersListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/bookcharacters?function=list&parent="+parentID+"&limit="+limit)
}

export function BookcharactersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/bookcharacters?function=count&parent="+parentID)
}

export function BookcharacterMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/bookcharacter?function=up&id="+id)
}

export function BookcharacterMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/bookcharacter?function=down&id="+id)
}

export function BookcharacterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/bookcharacter?id="+id)
}

export function BookcharacterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/bookcharacter?function="+func+"&id="+id)
}

// file handling

export function BookcharacterUpload(user, id, formData) {
    return AxiosPOST(user, "api/bookcharacter?function=upload&id="+id, formData)
}

export function BookcharacterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/bookcharacters?function=initupload&parent="+parentID, formData)
}

export function BookcharacterInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/bookcharacters?function=inituploads&parent="+parentID, formData)
}

// misc

export function BookcharacterChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function BookcharacterChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/bookcharacters?function=prompt&parent="+parentID, payload)
}

export function BookcharacterChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/bookcharacter?function=prompt&id="+id, payload)
}