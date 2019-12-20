import DataLoader from 'dataloader';
import {UserModel} from 'model/index';

// 1
async function batchUsers(keys: any) {
    const result = (await UserModel.find({_id: {$in: keys}}));

    return result;
}

// 2
export default () =>
  // 3
   new DataLoader(
    keys => batchUsers(keys),
    {cacheKeyFn: key => (key as any).toString()},
  );
