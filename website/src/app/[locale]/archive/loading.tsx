import clsx from 'clsx';

const PlaceholderItem = ({ classes, times, rounded }: any) => {
  return [...Array(times).keys()].map((i: number) => (
    <div
      className={clsx(
        'inline-block',
        classes,
        rounded && i == 0 && 'rounded-l-sm',
        rounded && i == times - 1 && 'rounded-r-sm',
      )}
      key={i}
    />
  ));
};

const SuspenseItem = ({ empty }: { empty: boolean }) => {
  return (
    <div className="mb-[12px] min-w-[290px] max-w-[450px]">
      <div
        className="loading-article-background relative flex h-full min-h-[250px] flex-col
          items-center justify-center overflow-hidden rounded-3xl pl-6 before:absolute
          before:bottom-0 before:left-0 before:right-0 before:top-0 before:animate-shimmer">
        {!empty && (
          <div className="relative animate-pulse">
            <div className="flex">
              <div className="grow">
                <div>
                  <PlaceholderItem
                    classes="w-10 h-5 loading-placeholder-light"
                    times={3}
                    rounded={true}
                  />
                </div>
                <div className="mt-5">
                  <PlaceholderItem
                    classes="w-10 h-3 loading-placeholder-hard"
                    times={15}
                    rounded={false}
                  />
                  <div className="loading-placeholder-hard inline-block h-3 w-8" />
                </div>
              </div>
              <figure className="float-right mb-2 ml-5 mt-1 pr-5 text-sm">
                <div className="flex flex-col justify-center gap-2">
                  <PlaceholderItem
                    classes="loading-button h-[28px] w-[72px] rounded-lg"
                    times={3}
                  />
                </div>
              </figure>
            </div>
            <div className="mt-5">
              <div className="loading-placeholder-light inline-block h-4 w-10 rounded-l-sm" />
              <div className="loading-placeholder-light mr-1 inline-block h-4 w-10 rounded-r-sm" />
              <div className="loading-placeholder-light inline-block h-4 w-10 rounded-l-sm" />
              <div className="loading-placeholder-light mr-1 inline-block h-4 w-10 rounded-r-sm" />
              <div className="loading-placeholder-light inline-block h-4 w-10 rounded-l-sm" />
              <div className="loading-placeholder-light mr-1 inline-block h-4 w-10 rounded-r-sm" />
              <div className="loading-placeholder-light inline-block h-4 w-10 rounded-l-sm" />
              <div className="loading-placeholder-light mr-1 inline-block h-4 w-10 rounded-r-sm" />
              <div className="loading-placeholder-light inline-block h-4 w-10 rounded-l-sm" />
              <div className="loading-placeholder-light mr-1 inline-block h-4 w-10 rounded-r-sm" />
              <div className="loading-placeholder-light inline-block h-4 w-10 rounded-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SuspenseMasonryPage() {
  const empty = (i: number) => !(i % 5);

  return (
    <div className="w-full gap-3 px-[10px] py-[24px] sm:columns-2 sm:px-[24px] lx:columns-3">
      {[...Array(12).keys()].map((i) => (
        <SuspenseItem key={i} empty={empty(i)} />
      ))}
    </div>
  );
}
