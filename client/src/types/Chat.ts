export interface Sala {
    id: string,
    nombre: string,
    participantes: string[]
}
export interface Mensaje {
    id: string,
    salaId: string,
    emisorId: string,
    contenido: string,
    timestamp: string,
}