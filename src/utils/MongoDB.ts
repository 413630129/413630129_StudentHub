import { connect, Mongoose } from 'mongoose';
import { logger } from '../middlewares/log';
import { MongoInfo } from '../interfaces/MongoInfo';

export class MongoDB {
    DB: Mongoose | undefined;
    isConneted: boolean = false;

    constructor(info: MongoInfo) {
       const url = info.name && info.password
    ? `mongodb://${info.name}:${encodeURIComponent(info.password)}@${info.host}:${info.port}/${info.dbName}?authSource=admin`
    : `mongodb://${info.host}:${info.port}/${info.dbName}`;
        // log 用的網址,不含帳號密碼
        const safeUrl = `mongodb://${info.host}:${info.port}/${info.dbName}`;

        this.init(url)
            .then(() => {
                logger.info(`success: connect to mongoDB @${safeUrl}`);
                this.isConneted = true;
            })
            .catch((err) => {
                this.isConneted = false;
                console.error('MongoDB connect error:', err);
                logger.error(`error: cannot connect to mongoDB @${safeUrl} ${err}`);
            });
    }

    async init(url: string): Promise<void> {
        // 不在這裡 catch,讓連線失敗的錯誤往外丟給建構子處理
        this.DB = await connect(url);
    }

    getState(): boolean {
        return this.isConneted;
    }
}