import axios, { AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { HttpClientService } from "./http-client.service";

// Mock the external dependencies: axios and axios-retry
jest.mock("axios");
jest.mock("axios-retry");

/**
 * @describe Test suite for the HttpClientService.
 * This suite verifies the correct functionality of the HTTP client,
 * including its construction, retry configuration, and HTTP method wrappers.
 */
describe("HttpClientService", () => {
    let apiClient: HttpClientService;
    let mockAxiosInstance: Partial<AxiosInstance>;

    // A minimal config object required for mock Axios responses.
    const minimalConfig = { headers: {} } as any;

    /**
     * @beforeEach Sets up the test environment before each test case.
     * This involves creating a mock Axios instance and a new HttpClientService instance.
     */
    beforeEach(() => {
        // Create a mock object for the Axios instance with jest.fn() for each method.
        mockAxiosInstance = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            patch: jest.fn(),
            interceptors: {
                request: { use: jest.fn(), eject: jest.fn() } as any,
                response: { use: jest.fn(), eject: jest.fn() } as any,
            },
        };

        // Configure the mocked axios.create to return our mock instance.
        (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

        // Instantiate the service to be tested.
        apiClient = new HttpClientService("http://localhost", 1000, 2);
    });

    /**
     * @afterEach Cleans up mocks after each test case to ensure test isolation.
     */
    afterEach(() => {
        jest.clearAllMocks();
    });

    /**
     * @test Verifies that axios-retry is initialized with the correct parameters
     * from the HttpClientService constructor.
     */
    test("should configure axiosRetry with correct parameters", () => {
        expect(axiosRetry).toHaveBeenCalledWith(
            mockAxiosInstance,
            expect.objectContaining({
                retries: 2, // Check if the number of retries is passed correctly.
                retryDelay: expect.any(Function), // Check if a retry delay function is provided.
                retryCondition: expect.any(Function), // Check if a retry condition function is provided.
            })
        );
    });

    /**
     * @test Verifies that the `get` method correctly calls the underlying Axios instance's `get` method.
     */
    test("get method should call instance.get with correct arguments", async () => {
        // Mock the response for the get call.
        const response: AxiosResponse = {
            data: { result: "ok" },
            status: 200,
            statusText: "OK",
            headers: {},
            config: minimalConfig,
        };
        (mockAxiosInstance.get as jest.Mock).mockResolvedValue(response);

        // Call the method on the service.
        const result = await apiClient.get("/test");

        // Assert that the mock was called with the correct arguments.
        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test", undefined);
        // Assert that the method returns the mocked response.
        expect(result).toEqual(response);
    });

    /**
     * @test Verifies that the `post` method correctly calls the underlying Axios instance's `post` method.
     */
    test("post method should call instance.post with correct arguments", async () => {
        const response: AxiosResponse = {
            data: { result: "created" },
            status: 201,
            statusText: "Created",
            headers: {},
            config: minimalConfig,
        };
        (mockAxiosInstance.post as jest.Mock).mockResolvedValue(response);
        const payload = { name: "John" };

        const result = await apiClient.post("/test", payload);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
            "/test",
            payload,
            undefined
        );
        expect(result).toEqual(response);
    });

    /**
     * @test Verifies that the `put` method correctly calls the underlying Axios instance's `put` method.
     */
    test("put method should call instance.put with correct arguments", async () => {
        const response: AxiosResponse = {
            data: { result: "updated" },
            status: 200,
            statusText: "OK",
            headers: {},
            config: minimalConfig,
        };
        (mockAxiosInstance.put as jest.Mock).mockResolvedValue(response);
        const payload = { name: "Jane" };

        const result = await apiClient.put("/test", payload);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith(
            "/test",
            payload,
            undefined
        );
        expect(result).toEqual(response);
    });

    /**
     * @test Verifies that the `delete` method correctly calls the underlying Axios instance's `delete` method.
     * It also checks that the payload is correctly passed in the `data` property of the config.
     */
    test("delete method should call instance.delete with correct arguments", async () => {
        const response: AxiosResponse = {
            data: { result: "deleted" },
            status: 200,
            statusText: "OK",
            headers: {},
            config: minimalConfig,
        };
        (mockAxiosInstance.delete as jest.Mock).mockResolvedValue(response);
        const payload = { id: 1 };

        const result = await apiClient.delete("/test", payload);

        // Axios's delete method expects the payload in a 'data' property within the config object.
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/test", {
            data: payload,
        });
        expect(result).toEqual(response);
    });

    /**
     * @test Verifies that the `patch` method correctly calls the underlying Axios instance's `patch` method.
     */
    test("patch method should call instance.patch with correct arguments", async () => {
        const response: AxiosResponse = {
            data: { result: "patched" },
            status: 200,
            statusText: "OK",
            headers: {},
            config: minimalConfig,
        };
        (mockAxiosInstance.patch as jest.Mock).mockResolvedValue(response);
        const payload = { op: "replace", path: "/name", value: "Doe" };

        const result = await apiClient.patch("/test", payload);

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
            "/test",
            payload,
            undefined
        );
        expect(result).toEqual(response);
    });

    /**
     * @test Verifies that errors are correctly propagated through the `handleError` interceptor.
     */
    test("should propagate errors through handleError", async () => {
        // Define a mock error object that simulates an Axios error.
        const error = {
            code: "ERR_TEST",
            message: "Test error",
            response: {
                status: 500,
                data: { error: "Internal Server Error" },
            },
            request: {},
        };
        // Configure the mock to reject with the error.
        (mockAxiosInstance.get as jest.Mock).mockRejectedValue(error);

        // Assert that calling the method results in a rejection with the same error object.
        await expect(apiClient.get("/test")).rejects.toEqual(error);
    });
});