import { HiddenProps, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class BaseEntity {

    @PrimaryKey({type: 'uuid'})
    id!: string;

    @Property({hidden: true})
    createdAt: Date = new Date();

    @Property({ hidden: true, onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    constructor(){
        this.id = v4()
    }
}