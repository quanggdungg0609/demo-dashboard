import { DataSource, DataSourceOptions } from "typeorm";
import { Corrosion } from "./src/entity/Corrosion";

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'], // Tùy chọn logging
  entities: [Corrosion],
}

let AppDataSource: DataSource;
// singleton to handle datasource 
export const getDataSource = async (): Promise<DataSource> => {
    if (AppDataSource && AppDataSource.isInitialized) {
      // console.log('DataSource has already been initialized.');
      return AppDataSource;
    }
  
    // console.log('Initializing DataSource...');
    AppDataSource = new DataSource(dataSourceOptions);
  
    try {
      await AppDataSource.initialize();
      // console.log('DataSource has been initialized successfully.');
    } catch (error) {
      console.error('Error during DataSource initialization:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  
    return AppDataSource;
  };