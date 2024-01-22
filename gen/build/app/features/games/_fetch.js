import { PublicFetch, AxiosPOST } from '@/app/fetch';
import SessionFetch from '@/app/fetch';
import InputFormat from '@/inputs/inputFormat';

export function GamesInitPOST(user, parentID, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/games?function=init&parent="+parentID, p)
}

export function GameUpdatePOST(user, id, payload) {
    var p = InputFormat(payload)
    return SessionFetch(user, "POST", "api/game?function=update&id="+id, p)
}

export function GameObjectGET(user, id) {
    return SessionFetch(user, "GET", "api/game?function=object&id="+id)
}

export function GamesListGET(user, parentID, limit) {
    return SessionFetch(user, "GET", "api/games?function=list&parent="+parentID+"&limit="+limit)
}

export function GamesCountGET(user, parentID) {
    return SessionFetch(user, "GET", "api/games?function=count&parent="+parentID)
}

export function GameMoveUpPOST(user, id) {
    return SessionFetch(user, "POST", "api/game?function=up&id="+id)
}

export function GameMoveDownPOST(user, id) {
    return SessionFetch(user, "POST", "api/game?function=down&id="+id)
}

export function GameDELETE(user, id) {
    return SessionFetch(user, "DELETE", "api/game?id="+id)
}

export function GameFunctionPOST(user, id, func) {
    return SessionFetch(user, "POST", "api/game?function="+func+"&id="+id)
}

// file handling

export function GameUpload(user, id, formData) {
    return AxiosPOST(user, "api/game?function=upload&id="+id, formData)
}

export function GameInitUpload(user, parentID, formData) {
    return AxiosPOST(user, "api/games?function=initupload&parent="+parentID, formData)
}

export function GameInitUploads(user, parentID, formData) {
    return AxiosPOST(user, "api/games?function=inituploads&parent="+parentID, formData)
}

// misc

export function GameOpenaiPOST(user, parentID, formData) {
    return AxiosPOST(user, "api/openai?function=collectionprompt&parent="+parentID, formData)
}