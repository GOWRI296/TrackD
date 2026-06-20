export default function ProductivityHeatmap({
  data,
}: {
  data: any[];
}) {

  return (
    <div className="card mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Productivity Heatmap
      </h2>

      <div className="grid grid-cols-7 gap-3">

        {data.map((item, index) => {

          const score =
            item.productivity_score || 0;

          let intensity =
            "bg-slate-800";

          if (score >= 90) {
            intensity = "bg-green-500";
          }
          else if (score >= 70) {
            intensity = "bg-green-700";
          }
          else if (score >= 50) {
            intensity = "bg-yellow-600";
          }
          else if (score >= 30) {
            intensity = "bg-orange-600";
          }
          else {
            intensity = "bg-red-700";
          }

          return (
            <div
              key={index}
              className={`
                h-14
                rounded-lg
                flex
                items-center
                justify-center
                text-xs
                font-bold
                ${intensity}
              `}
            >
              {score}
            </div>
          );
        })}

      </div>

    </div>
  );
}