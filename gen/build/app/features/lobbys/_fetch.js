import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function LobbysInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/lobbys?function=init&parent="+parentID, p)
}

export function LobbyUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/lobby?function=update&id="+id, p)
}

export function LobbyObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/lobby?function=object&id="+id)
}

export function LobbysListGET(user, parentID, mode, limit) {
    return SessionFetch(user, "GET", "api/lobbys?function=list&parent="+parentID+"&mode="+mode+"&limit="+limit)
}

export function LobbysCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/lobbys?function=count&parent="+parentID)
}

export function LobbyOrderPOST(user, id, mode) {
    return SessionFetch(user, "POST", "api/lobby?function=order&mode="+mode+"&id="+id)
}

export function LobbyDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/lobby?id="+id)
}

export function LobbyFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/lobby?function="+func+"&id="+id)
}

export function LobbyJobPOST(user, id, job) {
    return SessionFetch(user, "POST", "api/lobby?function=job&job="+job+"&id="+id)
}

// file handling

export function LobbyUpload(user, id, mode, formData) {
    return AxiosPOST(user, "api/lobby?function=upload&id="+id+"&mode="+mode, formData)
}

export function LobbysUpload(user, parentID, mode, formData) {
    return AxiosPOST(user, "api/lobbys?function=upload&parent="+parentID+"&mode="+mode, formData)
}

// misc

export function LobbysChatGPTPOST(user, parentID, mode, payload) {
    return SessionFetch(user, "POST", "api/lobbys?function=prompt&mode="+mode+"&parent="+parentID, payload)
}

export function LobbyAdminPOST(user, id, mode, admin) {
    return SessionFetch(user, "POST", "api/lobby?function=admin&mode="+mode+"&id="+id+"&admin="+admin)
}