import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function QuartersInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/quarters?function=init&parent="+parentID, p)
}

export function QuarterUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/quarter?function=update&id="+id, p)
}

export function QuarterObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/quarter?function=object&id="+id)
}

export function QuartersListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/quarters?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function QuartersCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/quarters?function=count&parent="+parentID)
}

export function QuarterMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/quarter?function=up&id="+id)
}

export function QuarterMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/quarter?function=down&id="+id)
}

export function QuarterDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/quarter?id="+id)
}

export function QuarterFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/quarter?function="+func+"&id="+id)
}

export function QuarterJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/quarter?function=job&job="+job+"&id="+id)
}

// file handling

export function QuarterUpload(user, id, formData) {
    return AxiosPOST(user, "api/quarter?function=upload&id="+id, formData)
}

export function QuarterInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/quarters?function=initupload&parent="+parentID, formData)
}

export function QuarterInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/quarters?function=inituploads&parent="+parentID, formData)
}

// misc

export function QuarterChatGPTModifyPOST(user, parentID, collectionID, payload) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, payload)
}

export function QuarterChatGPTInitPOST(user, parentID, payload) {
    return SessionFetch(user, "POST", "api/quarters?function=prompt&parent="+parentID, payload)
}

export function QuarterChatGPTPromptPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/quarter?function=prompt&id="+id, payload)
}

export function QuarterAdminAddPOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/quarter?function=addadmin&id="+id, payload)
}

export function QuarterAdminRemovePOST(user, id, payload) {
    return SessionFetch(user, "POST", "api/quarter?function=removeadmin&id="+id, payload)
}