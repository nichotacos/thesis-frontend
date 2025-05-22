import { Module } from "react-native";

export type Level = {
    _id: string;
    name: string;
    actualBipaLevel: string;
    description: string;
    level_image: string;
    modules: Module[];
    createdAt?: Date;
    updatedAt?: Date;
}