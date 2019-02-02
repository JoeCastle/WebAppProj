export default interface UserDetails {
    user: {
        username ?: string; //? allows undefined
        userID: number;
        userRole: string;
        firstname: string;
        surname: string;
        jwt: string;
        groupID: number;
    }
}
