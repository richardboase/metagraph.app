import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function StreetsInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/streets?function=init&parent="+parentID, p)
}

export function StreetUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/street?function=update&id="+id, p)
}

export function StreetObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/street?function=object&id="+id)
}

export function StreetsListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/streets?function=list&parent="+parentID+"&limit="+limit)
}

export function StreetsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/streets?function=count&parent="+parentID)
}

export function StreetMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/street?function=up&id="+id)
}

export function StreetMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/street?function=down&id="+id)
}

export function StreetDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/street?id="+id)
}

export function StreetFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/street?function="+func+"&id="+id)
}

// file handling

export function StreetUpload(user, id, formData) {
    return AxiosPOST(user, "api/street?function=upload&id="+id, formData)
}

export function StreetInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/streets?function=initupload&parent="+parentID, formData)
}

export function StreetInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/streets?function=inituploads&parent="+parentID, formData)
}

// misc

export function StreetOpenaiPOST(user, parentID, collectionID, formData) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&collection="+collectionID+"&parent="+parentID, formData)
}