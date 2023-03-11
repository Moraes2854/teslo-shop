import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { IProduct } from '../interfaces';
import { tesloApi } from '../api';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']


interface FormData {
    _id?:        string;
    description: string;
    images:      string[];
    inStock:     number;
    price:       number;
    sizes:       string[];
    slug:        string;
    tags:        string[];
    title:       string;
    type:        string;
    gender:      string;
}

const formDefaultValues: FormData = {
    description: '',
    gender: 'unisex',
    images:[],
    inStock: 0,
    price: 0,
    slug: '',
    sizes: [],
    tags: [],
    title: '',
    type: 'shirts',
}

export const useProductAdminPage = ( product?: IProduct ) => {

    const router = useRouter();
    const [ newTagValue, setNewTagValue ] = useState<string>('');
    const [ isSaving, setIsSaving ] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: ( product ) ? product : formDefaultValues,
    });
    
    useEffect(()=>{
        const suscription = watch(( value, { name, type } ) => {
            if ( name === 'title'){
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';

                setValue('slug', newSlug );
            }

        })

        return () => {
            suscription.unsubscribe();
        }

    }, [ watch, setValue ])

    const onChangeSize = ( size: string ) => {
        const currentSizes = getValues('sizes');

        if ( currentSizes.includes( size ) ) setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true } );
        else setValue('sizes', [ ...currentSizes, size ], { shouldValidate: true } );
    }

    const onTypeChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => ( validTypes.includes( target.value ) ) && setValue('type', target.value , { shouldValidate: true } )

    const onGenderChange = ( { target }: React.ChangeEvent<HTMLInputElement> ) => ( validGender.includes( target.value ) ) && setValue('gender', target.value , { shouldValidate: true } )

    const onNewValueTagChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewTagValue(target.value)
    }

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if (currentTags.includes( newTag )) return;

        currentTags.push( newTag );
    }

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag);
        setValue('tags', updatedTags, { shouldValidate: true });
    }

    const onDeleteImage = ( image: string ) => {

        setValue( 
            'images', 
            getValues('images').filter( img => img !== image ), 
            { shouldValidate: true } 
        );

    }

    const onFilesSelected = async( { target }: React.ChangeEvent<HTMLInputElement> ) => {
        if ( !target.files || target.files.length === 0 ) return;


        try {
            for( const file of target.files ) {

                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApi.post<{ message: string}>('/admin/upload', formData);
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true });

            }
        } catch (error) {
            console.log({ error });
        }

    }

    const onUpdateProductForm = async( form: FormData ) => {
        if ( form.images.length < 2 ) return alert('Se necesitan mínimo 2 imagenes');

        setIsSaving( true );

        try {
            
            const { data } = await tesloApi({
                url: '/admin/products',
                // method: form._id ? 'PUT' : 'POST',
                method: 'PUT',
                data: form
            });

            setIsSaving( false );
            // if ( !form._id ){
            //     router.replace(`/admin/products/${ form.slug }`);
            // } else {
            //     setIsSaving( false );
            // }

            
        } catch (error) {
            console.log( error );
            setIsSaving( false );
        }
    } 

    const onCreateProductForm = async( form: FormData ) => {
        if ( form.images.length < 2 ) return alert('Se necesitan mínimo 2 imagenes');

        setIsSaving( true );

        try {
            const { data } = await tesloApi({
                url: '/admin/products',
                method: 'POST',
                data: form
            });

            setIsSaving( false );
            router.replace(`/admin/products/${ form.slug }`);
            router.reload();      
        } catch (error) {
            console.log( error );
            setIsSaving( false );
        }
    }

    return {
        errors,
        getValues,
        handleSubmit,
        newTagValue,
        onChangeSize,
        onDeleteTag,
        onGenderChange,
        onNewTag,
        onNewValueTagChange,
        onUpdateProductForm,
        onCreateProductForm,
        onTypeChange,
        register,
        isSaving,
        onFilesSelected,
        onDeleteImage
    }
}
