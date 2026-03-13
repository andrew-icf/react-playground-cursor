import './ImageList.scss';
import ImageDetail from '../ImageDetail/ImageDetail'

const ImageList = ({imageSearch} : any) => {
    console.log('imageSearch', imageSearch);
    const renderedImages = imageSearch.map((image: any) => {
        return (
            <div key={image.id}>
                <ImageDetail image={image}  />
            </div>
        )
    });
    
    return (
        <div className='image-list'>
            <p>Image List:</p>
            { renderedImages }
        </div>
    )
}

export default ImageList;