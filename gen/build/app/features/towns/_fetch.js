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

export function TownsListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/towns?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function TownsCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/towns?function=count&parent="+parentID)
}

export function TownOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/town?function=order&mode="+mode+"&id="+id)
}

export function TownDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/town?id="+id)
}

export function TownFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/town?function="+func+"&id="+id)
}

export function TownJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/town?function=job&job="+job+"&id="+id)
}

// file handling

export function TownUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/town?function=upload&id="+id+"&mode="+mode, formData)
}

export function TownsUpload(user, parentID, mode, formData) {
    return AxiosPOST(user, "api/towns?function=upload&parent="+parentID+"&mode="+mode, formData)
}

// misc

export function TownsChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/towns?function=prompt&mode="+mode+"&parent="+parentID, payload)
}

export function TownAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/town?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}