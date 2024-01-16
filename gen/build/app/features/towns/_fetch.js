import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function TownsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/towns?function=init&parent="+parentID, p)
}

export function TownUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/town?function=update&id="+id, p)
}

export function TownObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/town?function=object&id="+id)
}

export function TownsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/towns?function=list&parent="+parentID+"&limit="+limit)
}

export function TownsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/towns?function=count&parent="+parentID)
}

export function TownMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/town?function=up&id="+id)
}

export function TownMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/town?function=down&id="+id)
}

export function TownDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/town?id="+id)
}

export function TownFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/town?function="+func+"&id="+id)
}

// file handling

export function TownUpload(user, id, formData) {
    return AxiosPOST(user, "api/town?function=upload&id="+id, formData)
}

export function TownInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/towns?function=initupload&parent="+parentID, formData)
}

export function TownInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/towns?function=inituploads&parent="+parentID, formData)
}