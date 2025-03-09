import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Database, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { testDatabaseConnection } from "@/lib/api";

interface ConnectionResult {
  success: boolean;
  message: string;
  data?: {
    current_time: string;
    database: string;
  };
  error?: string;
}

const DatabaseConnectionTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConnectionResult | null>(null);

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const response = await testDatabaseConnection();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message: "Không thể kết nối đến API",
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Kiểm tra kết nối cơ sở dữ liệu
        </CardTitle>
        <CardDescription>
          Kiểm tra kết nối đến PostgreSQL trên Docker
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result && (
          <div className="mb-4">
            {result.success ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  Kết nối thành công
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Thời gian hiện tại
                      </Badge>
                      <span>{result.data?.current_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Cơ sở dữ liệu
                      </Badge>
                      <span>{result.data?.database}</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Kết nối thất bại</AlertTitle>
                <AlertDescription>
                  {result.error || result.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            "Kiểm tra kết nối"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseConnectionTest;
