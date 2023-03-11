export interface IUser {
    _id:        string;
    name:       string;
    email:      string;
    password?:   string;
    role:       'client'|'admin'|'super-user'|'SEO';
    createdAt:  string;
    updatedAt:  string;
}