import bcrypt from 'bcrypt'; 
import db from '../models/index'; 
import { where } from 'sequelize';

const salt = bcrypt.genSaltSync(10); 

interface UserData {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: string;
    roleId: string;
}

let createNewUser = async (data: UserData): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => { 
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            })
            resolve('OK create a new user successfull');
        } catch (e) {
            reject(e)
        }
    })
}

let hashUserPassword = (password: string): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => { 
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = (): Promise<any[]> => {
    return new Promise<any[]>(async (resolve, reject) => { 
        try {
            let users = await db.User.findAll({
                raw: true, 
            });
            resolve(users); 
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInfoById = (userId: number): Promise<any | []> => {
    return new Promise<any | []>(async (resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: { id: userId }, 
                raw: true
            });
            if (user) {
                resolve(user); 
            } else {
                resolve([]); 
            }
        } catch (e) {
            reject(e)
        }
    })
}

let updateUser = (data: UserData): Promise<any[] | void> =>{
    return new Promise<any[] | void>(async (resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: { id: data.id } 
            });
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                let allusers = await db.User.findAll();
                resolve(allusers);
            }else{
                resolve(void 0); // fix lỗi TS
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUserById = (userId: number): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
            }
            resolve(void 0); // fix lỗi TS
        } catch (e) {
            reject(e);
        }
    })
}

export default {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUser,
    deleteUserById
}
