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

export function LobbysListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/lobbys?function=list&parent="+parentID+"&limit="+limit)
}

export function LobbysCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/lobbys?function=count&parent="+parentID)
}

export function LobbyMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/lobby?function=up&id="+id)
}

export function LobbyMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/lobby?function=down&id="+id)
}

export function LobbyDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/lobby?id="+id)
}

export function LobbyFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/lobby?function="+func+"&id="+id)
}

// file handling

export function LobbyUpload(user, id, formData) {
    return AxiosPOST(user, "api/lobby?function=upload&id="+id, formData)
}

export function LobbyInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/lobbys?function=initupload&parent="+parentID, formData)
}

export function LobbyInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/lobbys?function=inituploads&parent="+parentID, formData)
}

// misc

export function LobbyOpenaiPOST(user, parentID, formData) {
    return SessionFetch(user, "POST", "api/openai?function=collectionprompt&parent="+parentID, formData)
}