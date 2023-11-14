import { valibotResolver } from '@hookform/resolvers/valibot';
import { onValue, ref, set } from 'firebase/database';
import { db } from 'modules/firebase';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMatch } from 'react-router-dom';
import { Input, object, string, optional } from 'valibot';

const TheatreMetaSchema = object({
  name: string(),
  message: optional(string()),
});

export const TheatreDetail: React.FC = () => {
  const match = useMatch('/admin/:uuid');

  const { register, reset, handleSubmit, formState } = useForm<
    Input<typeof TheatreMetaSchema>
  >({
    resolver: valibotResolver(TheatreMetaSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!match?.params.uuid) return;

    set(ref(db, `v2/theatres/${match.params.uuid}/meta`), data);
  });

  useEffect(() => {
    if (!match?.params.uuid) return;

    return onValue(
      ref(db, `v2/theatres/${match.params.uuid}/meta`),
      (snapshot) => {
        reset(snapshot.val());
      },
    );
  }, []);

  if (!match?.params.uuid) {
    return <div>not found</div>;
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <input
              className="w-full border rounded px-4 py-2"
              placeholder="Name"
              {...register('name')}
            />
            {formState.errors.name && <p>{formState.errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <textarea
              className="w-full border rounded px-4 py-2"
              placeholder="Message"
              {...register('message')}
            />
            {formState.errors.message && (
              <p>{formState.errors.message.message}</p>
            )}
          </div>
          <input
            className="bg-purple-500 text-white px-4 py-2 rounded"
            type="submit"
            value="Save"
          />
        </div>
      </form>
    </div>
  );
};