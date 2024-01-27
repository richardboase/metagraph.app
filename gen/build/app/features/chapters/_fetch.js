import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function ChaptersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/chapters?function=init&parent="+parentID, p)
}

export function ChapterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/chapter?function=update&id="+id, p)
}

export function ChapterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/chapter?function=object&id="+id)
}

export function ChaptersListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/chapters?function=list&parent="+parentID+"&limit="+limit)
}

export function ChaptersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/chapters?function=count&parent="+parentID)
}

export function ChapterMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/chapter?function=up&id="+id)
}

export function ChapterMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/chapter?function=down&id="+id)
}

export function ChapterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/chapter?id="+id)
}

export function ChapterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/chapter?function="+func+"&id="+id)
}

// file handling

export function ChapterUpload(user, id, formData) {
    return AxiosPOST(user, "api/chapter?function=upload&id="+id, formData)
}

export function ChapterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/chapters?function=initupload&parent="+parentID, formData)
}

export function ChapterInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/chapters?function=inituploads&parent="+parentID, formData)
}

// misc

export function ChapterChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function ChapterChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/chapters?function=prompt&parent="+parentID, payload)
}