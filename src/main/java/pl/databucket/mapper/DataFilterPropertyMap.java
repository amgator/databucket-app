package pl.databucket.mapper;

import org.modelmapper.PropertyMap;
import pl.databucket.dto.DataFilterDto;
import pl.databucket.entity.DataFilter;

public class DataFilterPropertyMap extends PropertyMap<DataFilter, DataFilterDto> {

    @Override
    protected void configure() {
        map().setId(source.getId());
        map().setName(source.getName());
        map().setDescription(source.getDescription());
        map().setConfiguration(source.getConfiguration());

        map().setCreatedBy(source.getCreatedBy());
        map().setCreatedDate(source.getCreatedDate());
        map().setLastModifiedBy(source.getLastModifiedBy());
        map().setLastModifiedDate(source.getLastModifiedDate());
    }
}