// FileSystemWrapper.jsx
import { useParams, useLocation } from 'react-router-dom';
import { FileContextProvider } from './FileContext';

function FileSystemWrapper({ children }) {
    const params = useParams();
    const location = useLocation();

    return (
        <FileContextProvider routerParams={params} routerLocation={location}>
            {children}
        </FileContextProvider>
    );
}

export default FileSystemWrapper;