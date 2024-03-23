import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { api } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {};

const FlowersClassifier = (props: Props) => {
  const [loading, setLoading] = useState(false);
  let algorithms = [
    { label: "Decision Trees", value: "trees" },
    { label: "Random Forest", value: "random_forest" },
  ] as { label: string; value: "trees" | "random_forest" }[];

  let [trainedModels, setTrainedModels] = useState({
    trees: { accuracy: undefined, result: undefined },
    random_forest: { accuracy: undefined, result: undefined },
  });

  let trainModel = async (algorithm: string) => {
    setLoading(true);
    let response = await api.get(`/${algorithm}/train`);
    let data = (await response.data) as { accuracy: string };
    setTrainedModels((prev) => ({
      ...prev,
      [algorithm]: { accuracy: data.accuracy },
    }));
    setLoading(false);
  };

  let onSubmit = async (
    algorithm: "trees" | "random_forest",
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    let data = new FormData(event.currentTarget);
    let values = Object.fromEntries(data.entries());
    setLoading(true);
    let response = await api.post(`/${algorithm}/classify`, values);
    let result = (await response.data) as { class: string };
    setTrainedModels((prev) => ({
      ...prev,
      [algorithm]: { ...prev[algorithm], result: result.class },
    }));
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full h-full gap-8 p-5 border rounded-lg lg:p-16 bg-neutral-100/30">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold text-balance lg:text-4xl">
          Flowers Classifier 💐
        </h2>
        <p className="font-medium max-w-prose max-md:text-sm text-balance">
          This app uses a machine learning model to classify flowers based on
          provided information. You can choose between different algorithms
          below.
        </p>
      </div>
      <div className="flex flex-col w-full max-w-lg gap-6">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <h3 className="text-lg font-semibold text-neutral-700">
            Available algorithms
          </h3>
        </div>
        <Tabs
          defaultValue={algorithms[0].value}
          className="flex flex-col w-full space-y-4"
        >
          <TabsList>
            <div className="flex flex-row items-center w-full gap-2">
              {algorithms.map((algorithm) => (
                <TabsTrigger
                  className="w-full"
                  key={algorithm.value}
                  value={algorithm.value}
                >
                  {algorithm.label}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>

          {algorithms.map((algorithm) => (
            <TabsContent
              key={algorithm.value}
              value={algorithm.value}
              className="w-full"
            >
              <div key={algorithm.value} className="flex flex-col w-full gap-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-neutral-700">
                    {algorithm.label}
                  </h3>
                  <Button onClick={() => trainModel(algorithm.value)}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="ml-2">Training...</span>
                      </>
                    ) : (
                      "Train model"
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-base font-medium text-neutral-700">
                    Accuracy:
                  </p>
                  <p className="text-base font-semibold text-primary-600">
                    {trainedModels[algorithm.value]?.accuracy ?? "N/A"}
                  </p>
                </div>
                <hr className="my-3" />
                <h4 className="text-base font-semibold text-neutral-700">
                  Classify a flower
                </h4>
                <form onSubmit={(event) => onSubmit(algorithm.value, event)}>
                  <fieldset
                    className="flex flex-col gap-4"
                    disabled={
                      loading || !trainedModels[algorithm.value]?.accuracy
                    }
                  >
                    <div className="grid grid-cols-2 gap-x-2">
                      <Label className="grid w-full gap-2">
                        <span>Sepal Length</span>
                        <Input
                          type="number"
                          step="0.01"
                          name="sepal_length"
                          placeholder="Sepal Length"
                        />
                      </Label>

                      <Label className="grid w-full gap-2">
                        <span>Sepal Width</span>
                        <Input
                          type="number"
                          step="0.01"
                          name="sepal_width"
                          placeholder="Sepal Width"
                        />
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <Label className="grid w-full gap-2">
                        <span>Petal Length</span>
                        <Input
                          type="number"
                          step="0.01"
                          name="petal_length"
                          placeholder="Petal Length"
                        />
                      </Label>
                      <Label className="grid w-full gap-2">
                        <span>Petal Width</span>
                        <Input
                          type="number"
                          step="0.01"
                          name="petal_width"
                          placeholder="Petal Width"
                        />
                      </Label>
                    </div>

                    <Button size={"lg"} type="submit">
                      Classify
                    </Button>
                  </fieldset>
                </form>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-base font-medium text-neutral-700">
                    Result:
                  </p>
                  <p className="text-base font-semibold text-primary-600">
                    {trainedModels[algorithm.value]?.result ?? "N/A"}
                  </p>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default FlowersClassifier;
