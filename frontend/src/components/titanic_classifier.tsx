import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const TitanicSurvivalClassifier = () => {
  const [loading, setLoading] = useState(false);
  const [trainedModel, setTrainedModel] = useState<
    | {
        accuracy: string | undefined;
        result: string | undefined;
      }
    | undefined
  >(undefined);

  const trainModel = async () => {
    setLoading(true);
    try {
      const response = await api.get("/titanic/train");
      const { accuracy } = response.data;
      setTrainedModel({ accuracy, result: "" }); // Add the missing 'result' property
    } catch (error) {
      console.error("Error training model:", error);
    } finally {
      setLoading(false);
    }
  };

  const predictSurvival = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const response = await api.post("/titanic/predict", data);
      const { result }: { result: string } = response.data;
      setTrainedModel((prev) => ({ accuracy: prev?.accuracy ?? "", result }));
    } catch (error) {
      console.error("Error predicting survival:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 border rounded-lg gap-y-16 bg-neutral-100/30">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold text-balance lg:text-4xl">
          Titanic Survival Classifier 🚢
        </h2>
        <p className="font-medium text-balance">
          This app uses a machine learning model to predict survival chances
          based on passenger attributes.
        </p>
      </div>
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-700">
            Titanic Survival Classifier
          </h3>
          <Button onClick={trainModel}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="ml-2">Training...</span>
              </>
            ) : (
              "Train Model"
            )}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-neutral-700">Accuracy:</p>
            <p className="text-base font-semibold text-primary-600">
              {trainedModel?.accuracy ?? "N/A"}
            </p>
          </div>
          <hr className="my-3" />
          <h4 className="text-base font-semibold text-neutral-700">
            Predict Survival
          </h4>
          <form onSubmit={predictSurvival}>
            <fieldset className="flex flex-col space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Label className="flex flex-col gap-2">
                  <span>Passenger Class</span>
                  <Select name="Pclass">
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Passnger Class"
                        className="h-10 xl:border-[1.5px]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </Label>

                <Label className="flex flex-col gap-2">
                  <span>Sex</span>
                  <Select name="Sex">
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Sex"
                        className="h-10 xl:border-[1.5px]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Label>

                <Label className="flex flex-col gap-2">
                  <span>Age</span>
                  <Input type="number" name="Age" placeholder="Age" />
                </Label>

                <Label className="flex flex-col gap-2">
                  <span>Siblings/Spouses Aboard</span>
                  <Input
                    type="number"
                    name="SibSp"
                    placeholder="Siblings/Spouses Aboard"
                  />
                </Label>
              </div>
              <div className="w-full">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Predicting..." : "Predict"}
                </Button>
              </div>
            </fieldset>
          </form>
          <div className="flex items-center justify-between">
            <p className="text-base font-medium text-neutral-700">Result:</p>
            <p className="text-base font-semibold text-primary-600">
              {trainedModel?.result ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitanicSurvivalClassifier;
