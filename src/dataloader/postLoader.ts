import DataLoader from 'dataloader';
import {PostModel} from 'model/index';

// 1
async function batchPosts(keys: any) {
    const result = (await PostModel.find({_id: {$in: keys}}));

    return result;
}

// 2
export default () =>
  // 3
   new DataLoader(
    keys => batchPosts(keys),
    {cacheKeyFn: key => (key as any).toString()},
  );
